import asyncio
import aiohttp
import aiofiles
import os
from bs4 import BeautifulSoup
from datetime import datetime
from urllib.parse import urljoin
import re

# 读取代理配置（从环境变量，aiohttp默认不读系统代理）
# 用法: HTTPS_PROXY=http://127.0.0.1:7890 python fetch_wallhaven_images.py
PROXY = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy") or None

# 请求间隔控制：避免高频并发被服务器限流断开(wallhaven对高频返回429)
REQUEST_DELAY = 1.5      # 每次请求之间的基础间隔(秒)
RETRY_TIMES = 3          # 失败重试次数
RETRY_DELAY = 3.0        # 重试间隔(秒)


class WallhavenImageFetcher:
    BASE_URL = "https://wallhaven.cc/random?seed=bfWO1N"

    def __init__(self, max_concurrent=2):
        self.max_concurrent = max_concurrent  # 并发降到2，避免被打断
        self.session = None
        self.semaphore = None

    async def init(self):
        # 若配置了代理，创建支持代理的会话
        if PROXY:
            self.session = aiohttp.ClientSession(proxy=PROXY)
        else:
            self.session = aiohttp.ClientSession()
        self.semaphore = asyncio.Semaphore(self.max_concurrent)

    async def close(self):
        if self.session:
            await self.session.close()

    async def _request_with_retry(self, url, **kwargs):
        """带重试和间隔的GET请求，返回 response 对象或 None"""
        for attempt in range(RETRY_TIMES):
            try:
                async with self.semaphore:
                    # 请求前小间隔，避免高频触发限流
                    await asyncio.sleep(REQUEST_DELAY * (attempt + 1) * 0.3)
                    resp = await self.session.get(url, **kwargs)
                    if resp.status == 200:
                        return resp
                    print(f"  [重试] {url.split('/')[-1]} 状态码 {resp.status}, 尝试 {attempt+1}/{RETRY_TIMES}")
                    await resp.release()
            except Exception as e:
                print(f"  [重试] {url.split('/')[-1]} 出错 {e}, 尝试 {attempt+1}/{RETRY_TIMES}")
            await asyncio.sleep(RETRY_DELAY)
        return None

    async def fetch_page(self, page_num):
        url = f"{self.BASE_URL}&page={page_num}"
        try:
            resp = await self._request_with_retry(url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            if not resp:
                print(f"Page {page_num} 请求失败(重试耗尽)")
                return []

            html = await resp.text()
            print(f"Page {page_num}: 响应状态码: {resp.status}, HTML长度: {len(html)}")
            await resp.release()

            soup = BeautifulSoup(html, 'html.parser')

            # 优先精确class，兜底用所有li过滤/w/链接
            li_tags = soup.find_all('li', class_='thumb-listing__item')
            if len(li_tags) == 0:
                li_tags = soup.find_all('li')

            image_urls = []
            for li in li_tags:
                a_tag = li.find('a')
                if a_tag and a_tag.get('href'):
                    href = a_tag['href']
                    if href.startswith('https://wallhaven.cc/w/') or href.startswith('/w/'):
                        if href.startswith('/'):
                            href = urljoin('https://wallhaven.cc/', href)
                        image_urls.append(href)

            print(f"Page {page_num}: 找到 {len(image_urls)} 个图片链接")
            if image_urls:
                print(f"Page {page_num}: 前3个链接: {image_urls[:3]}")
            return image_urls
        except Exception as e:
            print(f"Page {page_num} 请求出错: {e}")
            return []

    async def fetch_image_page(self, image_page_url):
        """获取详情页里的真实图片直链（id=wallpaper的img）"""
        try:
            resp = await self._request_with_retry(image_page_url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            if not resp:
                return None

            html = await resp.text()
            await resp.release()
            soup = BeautifulSoup(html, 'html.parser')

            img_tag = soup.find('img', id='wallpaper')
            if img_tag and img_tag.get('src'):
                return img_tag['src']

            alt_img = soup.find('img', class_='scroll-hidden')
            if alt_img and alt_img.get('data-src'):
                return alt_img['data-src']

            # 兜底：任何 wallhaven 图片直链
            any_img = soup.find('img', src=re.compile(r'wallhaven.*\.(jpg|png)'))
            if any_img and any_img.get('src'):
                return any_img['src']

            return None
        except Exception as e:
            print(f"获取图片页面 {image_page_url} 出错: {e}")
            return None

    async def download_image(self, image_url, save_dir):
        try:
            filename = image_url.split('/')[-1]
            if '?' in filename:
                filename = filename.split('?')[0]

            if not filename or len(filename) < 3:
                filename = f"wallhaven_{datetime.now().strftime('%Y%m%d%H%M%S')}.jpg"

            file_path = os.path.join(save_dir, filename)

            if os.path.exists(file_path):
                print(f"文件已存在，跳过: {filename}")
                return True

            # 下载图片：带Referer绕过防盗链
            resp = await self._request_with_retry(image_url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://wallhaven.cc/'
            })
            if not resp:
                return False

            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(await resp.read())
            await resp.release()
            print(f"下载成功: {filename}")
            return True
        except Exception as e:
            print(f"下载图片 {image_url} 出错: {e}")
            return False

    async def process_image(self, image_page_url, save_dir):
        try:
            image_url = await self.fetch_image_page(image_page_url)
            if image_url:
                return await self.download_image(image_url, save_dir)
            return False
        except Exception as e:
            print(f"处理图片 {image_page_url} 出错: {e}")
            return False

    async def run(self, start_page=1, end_page=2):
        if start_page >= end_page:
            raise ValueError(f"start_page ({start_page}) 必须小于 end_page ({end_page})")

        if start_page < 1:
            raise ValueError(f"start_page ({start_page}) 必须大于等于 1")

        await self.init()

        today = datetime.now().strftime('%Y-%m-%d')
        save_dir = os.path.join(os.getcwd(), 'images', today)
        os.makedirs(save_dir, exist_ok=True)
        print(f"保存目录: {save_dir}")

        total_success = 0

        # 分页串行处理（不再gather并发所有页），每页内部并发受限
        for page_num in range(start_page, end_page + 1):
            print(f"\n===== 处理第 {page_num} 页 =====")
            image_page_urls = await self.fetch_page(page_num)

            tasks = [self.process_image(u, save_dir) for u in image_page_urls]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            page_success = sum(1 for r in results if r is True)
            total_success += page_success
            print(f"Page {page_num}: 成功下载 {page_success}/{len(image_page_urls)} 张图片")
            # 页间休息，降低整体请求频率
            await asyncio.sleep(2.0)

        print(f"\n总计: 成功下载 {total_success} 张图片")
        print(f"保存位置: {save_dir}")

        await self.close()
        return total_success


async def main():
    import sys
    start = 1
    end = 10
    if len(sys.argv) >= 3:
        start = int(sys.argv[1])
        end = int(sys.argv[2])
    fetcher = WallhavenImageFetcher(max_concurrent=2)
    await fetcher.run(start_page=start, end_page=end)


if __name__ == "__main__":
    asyncio.run(main())
