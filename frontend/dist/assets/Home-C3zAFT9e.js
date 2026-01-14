import{u as M,j as e}from"./index-DLZZqjEZ.js";import{u as A,r}from"./react-vendor-BNorfeeT.js";import{N as K}from"./Navbar-DUsblCAH.js";import{I as B}from"./ImageCard-BP-LJguv.js";import{f as D}from"./api-9C_kg36F.js";function V(){const{user:O}=M(),N=A(),[l,p]=r.useState([]),[I,x]=r.useState([]),[d,b]=r.useState(!0),[z,E]=r.useState(0),[a,w]=r.useState(""),[v,j]=r.useState(!1),[C,L]=r.useState(!1),[u,k]=r.useState(!1),[m,f]=r.useState(!0),[T,h]=r.useState(0),[g]=r.useState(40),i=async(t="",n=!1)=>{try{const c=n?T:0;n?k(!0):(b(!0),h(0));const o=await D(c,g,t,{forceRefresh:!0});n?(p(s=>[...s,...o]),x(s=>[...s,...o]),h(s=>s+g),f(o.length===g)):(p(o),x(o),h(g),f(o.length===g))}catch(c){console.error("Failed to load images:",c)}finally{n?k(!1):(b(!1),j(!1))}};r.useEffect(()=>{h(0),f(!0),p([]),x([]),i()},[N]),r.useEffect(()=>{const t=()=>{h(0),f(!0),p([]),x([]),i()};return window.addEventListener("popstate",t),()=>window.removeEventListener("popstate",t)},[]),r.useEffect(()=>{i()},[z]),r.useEffect(()=>{a.trim()||i()},[a]);const Y=()=>{E(t=>t+1)},F=t=>{t.preventDefault(),j(!0),a.trim()?i(a):i()},y=()=>{w(""),i()};r.useEffect(()=>{const t=()=>{L(window.scrollY>300),window.innerHeight+window.scrollY>=document.body.offsetHeight-200&&m&&!u&&!d&&i(a,!0)};return window.addEventListener("scroll",t),()=>window.removeEventListener("scroll",t)},[m,u,d,a]);const H=()=>{window.scrollTo({top:0,behavior:"smooth"})},R=()=>{const t=a?l:I;if(t.length>0){const n=[...t].sort(()=>Math.random()-.5);p(n.slice(0,l.length))}else i()};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"home-container",children:[e.jsx(K,{onImageUploaded:Y}),e.jsx("div",{className:"search-container",children:e.jsx("form",{onSubmit:F,className:"search-form",children:e.jsxs("div",{className:"search-input-wrapper",children:[e.jsx("input",{type:"text",placeholder:"搜索图片标题、描述或作者...",value:a,onChange:t=>w(t.target.value),className:"search-input",disabled:d}),e.jsxs("div",{className:"search-actions",children:[a&&e.jsx("button",{type:"button",onClick:y,className:"clear-button",disabled:d,title:"清除搜索",children:"×"}),e.jsx("button",{type:"submit",className:"search-button",disabled:d||v,children:v?"搜索中...":"搜索"}),e.jsx("button",{type:"button",onClick:R,className:"random-button",disabled:d,title:"随机显示图片",children:"随机"})]})]})})}),d?e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"正在加载精彩内容..."})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"custom-grid",children:l.length>0?e.jsx(e.Fragment,{children:(()=>{const t=[];let n=0;const c=[4,5,5,6,8];let o=0;for(;n<l.length;){const s=c[o%c.length],U=l.slice(n,n+s);t.push(e.jsx("div",{className:"grid-row",children:U.map(S=>e.jsx("div",{className:"grid-item",children:e.jsx(B,{image:S})},S.id))},o)),n+=s,o++}return t})()}):e.jsxs("div",{className:"no-results",children:[e.jsx("h2",{children:"未找到图片"}),e.jsx("p",{children:"尝试使用其他关键词搜索"}),a&&e.jsx("button",{onClick:y,className:"clear-search-btn",children:"查看所有图片"})]})}),u&&e.jsxs("div",{className:"load-more-container",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"正在加载更多图片..."})]}),!m&&l.length>0&&e.jsx("div",{className:"no-more-container",children:e.jsx("p",{children:"已经到底了~"})})]}),C&&e.jsx("button",{className:"scroll-top-btn",onClick:H,title:"返回顶部",children:"↑"})]}),e.jsx("style",{jsx:!0,children:`
        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 33%, #16213e 66%, #0f3460 100%);
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
          position: relative;
          overflow: hidden;
        }
        
        .home-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(74, 144, 226, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
          pointer-events: none;
          z-index: 0;
        }
        
        .home-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(74, 144, 226, 0.05)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          pointer-events: none;
          z-index: 0;
        }
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .search-container {
          max-width: 800px;
          margin: 20px auto;
          padding: 0 20px;
        }
        
        .search-form {
          display: flex;
          justify-content: center;
        }
        
        .search-input-wrapper {
          width: 100%;
          display: flex;
          background: linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 33%, #16213e 66%, #0f3460 100%);
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
          border-radius: 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          border: 1px solid rgba(74, 144, 226, 0.2);
        }
        
        .search-input {
          flex: 1;
          padding: 15px 20px;
          font-size: 16px;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
        }
        
        .search-input::placeholder {
          color: #888;
        }
        
        .search-actions {
          display: flex;
          align-items: center;
        }
        
        .clear-button {
          padding: 10px;
          margin: 0 5px;
          background: transparent;
          border: none;
          color: #888;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .clear-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        
        .search-button {
          padding: 15px 25px;
          background: linear-gradient(135deg, #4a90e2, #357abd);
          color: white;
          border: none;
          border-radius: 25px;
          margin: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .search-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #357abd, #2a6099);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        
        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        /* 随机按钮样式 */
        .random-button {
          padding: 15px 25px;
          background: linear-gradient(135deg, #4a90e2, #357abd);
          color: white;
          border: none;
          border-radius: 25px;
          margin: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .random-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #357abd, #2a6099);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        
        .random-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 50vh;
          gap: 20px;
          color: #ffffff;
          z-index: 1;
          position: relative;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(74, 144, 226, 0.3);
          border-top: 3px solid #4a90e2;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* 自定义网格布局样式 - 调整高度、圆角和间距 */
        .custom-grid {
          display: flex;
          flex-direction: column;
          gap: 7px; /* 上下间距统一7px */
          padding: 0 10px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        /* 行容器 - 宽度一致，左右对齐，间距统一 */
        .grid-row {
          display: flex;
          gap: 7px; /* 左右间距统一7px */
          justify-content: center;
          width: 100%;
        }
        
        /* 图片项 - 长方体，更细圆角 */
        .grid-item {
          flex: 0 0 auto;
          border-radius: 6px;
          overflow: hidden;
          background-color: #1a1a1a;
        }
        
        /* 图片容器 - 更高的高度，使用aspect-ratio控制比例 */
        .image-container {
          width: 100%;
          overflow: hidden;
          position: relative;
          background-color: #1a1a1a;
          border-radius: 6px;
          aspect-ratio: 1.5 / 1; /* 宽:高 = 1.5:1，高度更高 */
        }
        
        /* 图片 - 填满容器，保持比例，更细圆角 */
        .image-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px;
        }
        
        /* 第一行 - 4个图片，统一间距7px */
        .grid-row:nth-child(1) {
          gap: 7px;
        }
        
        .grid-row:nth-child(1) .grid-item {
          width: calc(25% - 5.25px); /* 4个图片，3个间距 */
        }
        
        /* 第二、三行 - 5个图片，统一间距7px */
        .grid-row:nth-child(2),
        .grid-row:nth-child(3) {
          gap: 7px;
        }
        
        .grid-row:nth-child(2) .grid-item,
        .grid-row:nth-child(3) .grid-item {
          width: calc(20% - 5.6px); /* 5个图片，4个间距 */
        }
        
        /* 第四行 - 6个图片，统一间距7px */
        .grid-row:nth-child(4) {
          gap: 7px;
        }
        
        .grid-row:nth-child(4) .grid-item {
          width: calc(16.67% - 5.83px); /* 6个图片，5个间距 */
        }
        
        /* 第五行及以下 - 8个图片，统一间距7px */
        .grid-row:nth-child(5) .grid-item,
        .grid-row:nth-child(n+5) .grid-item {
          width: calc(12.5% - 6.125px); /* 8个图片，7个间距 */
        }
        
        /* 返回顶部按钮 */
        .scroll-top-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4a90e2, #357abd);
          color: white;
          border: none;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
          transition: all 0.3s ease;
          z-index: 1000;
        }
        
        .scroll-top-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(74, 144, 226, 0.6);
        }
        
        /* 加载更多样式 */
        .load-more-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 30px 0;
          gap: 15px;
          color: #ffffff;
        }
        
        /* 没有更多图片样式 */
        .no-more-container {
          text-align: center;
          padding: 30px;
          color: #888888;
          font-size: 14px;
        }
        
        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #ffffff;
        }
        
        .no-results h2 {
          font-size: 2rem;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #ffffff, #4a90e2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .no-results p {
          color: #888;
          margin-bottom: 20px;
        }
        
        .clear-search-btn {
          background: linear-gradient(135deg, #4a90e2, #357abd);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .clear-search-btn:hover {
          background: linear-gradient(135deg, #357abd, #2a6099);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        
        @media (max-width: 768px) {
        .search-container {
          padding: 0 16px;
        }
        
        .search-form {
          flex-direction: column;
        }
        
        .search-input-wrapper {
          flex-direction: column;
        }
        
        .search-input {
          padding: 12px 15px;
        }
        
        .search-actions {
          justify-content: flex-end;
          padding: 5px 5px 5px 0;
        }
        
        .search-button {
          padding: 12px 20px;
        }
      }
      `})]})}export{V as default};
