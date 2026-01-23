import asyncio
import aiohttp
import aiofiles
import os
from bs4 import BeautifulSoup
from datetime import datetime
from urllib.parse import urljoin
import re


class WallhavenImageFetcher:
    BASE_URL = "https://wallhaven.cc/random?seed=bfWO1N"
    
    def __init__(self, max_concurrent=10):
        self.max_concurrent = max_concurrent
        self.session = None
        self.semaphore = None
        
    async def init(self):
        self.session = aiohttp.ClientSession()
        self.semaphore = asyncio.Semaphore(self.max_concurrent)
        
    async def close(self):
        if self.session:
            await self.session.close()
            
    async def fetch_page(self, page_num):
        url = f"{self.BASE_URL}&page={page_num}"
        async with self.semaphore:
            try:
                async with self.session.get(url, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }) as response:
                    print(f"Page {page_num}: 请求URL: {url}")
                    print(f"Page {page_num}: 响应状态码: {response.status}")
                    
                    if response.status == 200:
                        html = await response.text()
                        print(f"Page {page_num}: HTML长度: {len(html)}")
                        
                        soup = BeautifulSoup(html, 'html.parser')
                        
                        li_tags = soup.find_all('li', class_='thumb-listing__item')
                        print(f"Page {page_num}: 找到 {len(li_tags)} 个 li.thumb-listing__item 标签")
                        
                        if len(li_tags) == 0:
                            li_tags = soup.find_all('li')
                            print(f"Page {page_num}: 找到 {len(li_tags)} 个所有 li 标签")
                            if li_tags:
                                print(f"Page {page_num}: 第一个li的class: {li_tags[0].get('class')}")
                        
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
                    else:
                        print(f"Page {page_num} 请求失败，状态码: {response.status}")
                        return []
            except Exception as e:
                print(f"Page {page_num} 请求出错: {e}")
                import traceback
                traceback.print_exc()
                return []
    
    async def fetch_image_page(self, image_page_url):
        async with self.semaphore:
            try:
                async with self.session.get(image_page_url, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }) as response:
                    if response.status == 200:
                        html = await response.text()
                        soup = BeautifulSoup(html, 'html.parser')
                        
                        img_tag = soup.find('img', id='wallpaper')
                        if img_tag and img_tag.get('src'):
                            return img_tag['src']
                        
                        alt_img = soup.find('img', class_='scroll-hidden')
                        if alt_img and alt_img.get('data-src'):
                            return alt_img['data-src']
                        
                        return None
                    return None
            except Exception as e:
                print(f"获取图片页面 {image_page_url} 出错: {e}")
                return None
    
    async def download_image(self, image_url, save_dir):
        async with self.semaphore:
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
                
                async with self.session.get(image_url, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }) as response:
                    if response.status == 200:
                        async with aiofiles.open(file_path, 'wb') as f:
                            await f.write(await response.read())
                        print(f"下载成功: {filename}")
                        return True
                    else:
                        print(f"下载失败: {filename}, 状态码: {response.status}")
                        return False
            except Exception as e:
                print(f"下载图片 {image_url} 出错: {e}")
                return False
    
    async def fetch_and_download_page(self, page_num, save_dir):
        image_page_urls = await self.fetch_page(page_num)
        
        tasks = []
        for image_page_url in image_page_urls:
            task = self.process_image(image_page_url, save_dir)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        success_count = sum(1 for r in results if r is True)
        print(f"Page {page_num}: 成功下载 {success_count}/{len(image_page_urls)} 张图片")
        
        return success_count
    
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
        tasks = []
        
        for page_num in range(start_page, end_page + 1):
            task = self.fetch_and_download_page(page_num, save_dir)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks)
        total_success = sum(results)
        
        print(f"\n总计: 成功下载 {total_success} 张图片")
        print(f"保存位置: {save_dir}")
        
        await self.close()
        return total_success


async def main():
    fetcher = WallhavenImageFetcher(max_concurrent=10)
    await fetcher.run(start_page=1, end_page=10)


if __name__ == "__main__":
    asyncio.run(main())
