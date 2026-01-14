import{u as M,j as e}from"./index-C96Zm_Sn.js";import{r}from"./react-vendor-Ci7Csm7e.js";import{N as R}from"./Navbar-DgOobXlq.js";import{I as A}from"./ImageCard-DLYkI5V3.js";import{f as K}from"./api-BU5sBayF.js";function P(){const{user:B}=M(),[d,g]=r.useState([]),[N,u]=r.useState([]),[i,f]=r.useState(!0),[I,z]=r.useState(0),[s,m]=r.useState(""),[b,w]=r.useState(!1),[C,T]=r.useState(!1),[h,v]=r.useState(!1),[x,j]=r.useState(!0),[E,k]=r.useState(0),[c]=r.useState(40),p=async(t="",n=!1)=>{try{const l=n?E:0;n?v(!0):f(!0);const a=await K(l,c,t);n?(g(o=>[...o,...a]),u(o=>[...o,...a]),k(o=>o+c),j(a.length===c)):(g(a),u(a),k(c),j(a.length===c))}catch(l){console.error("Failed to load images:",l)}finally{n?v(!1):(f(!1),w(!1))}};r.useEffect(()=>{p()},[I]);const Y=()=>{z(t=>t+1)},F=t=>{t.preventDefault(),w(!0),p(s)},y=()=>{m(""),p()};r.useEffect(()=>{const t=()=>{T(window.scrollY>300),window.innerHeight+window.scrollY>=document.body.offsetHeight-200&&x&&!h&&!i&&p(s,!0)};return window.addEventListener("scroll",t),()=>window.removeEventListener("scroll",t)},[x,h,i,s]);const H=()=>{window.scrollTo({top:0,behavior:"smooth"})},L=()=>{const t=s?d:N;if(t.length>0){const n=[...t].sort(()=>Math.random()-.5);g(n.slice(0,d.length))}else p()};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"home-container",children:[e.jsx(R,{onImageUploaded:Y}),e.jsx("div",{className:"search-container",children:e.jsx("form",{onSubmit:F,className:"search-form",children:e.jsxs("div",{className:"search-input-wrapper",children:[e.jsx("input",{type:"text",placeholder:"搜索图片标题、描述或作者...",value:s,onChange:t=>m(t.target.value),className:"search-input",disabled:i}),e.jsxs("div",{className:"search-actions",children:[s&&e.jsx("button",{type:"button",onClick:y,className:"clear-button",disabled:i,title:"清除搜索",children:"×"}),e.jsx("button",{type:"submit",className:"search-button",disabled:i||b,children:b?"搜索中...":"搜索"}),e.jsx("button",{type:"button",onClick:L,className:"random-button",disabled:i,title:"随机显示图片",children:"随机"})]})]})})}),i?e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"正在加载精彩内容..."})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"custom-grid",children:d.length>0?e.jsx(e.Fragment,{children:(()=>{const t=[];let n=0;const l=[4,5,5,6,8];let a=0;for(;n<d.length;){const o=l[a%l.length],U=d.slice(n,n+o);t.push(e.jsx("div",{className:"grid-row",children:U.map(S=>e.jsx("div",{className:"grid-item",children:e.jsx(A,{image:S})},S.id))},a)),n+=o,a++}return t})()}):e.jsxs("div",{className:"no-results",children:[e.jsx("h2",{children:"未找到图片"}),e.jsx("p",{children:"尝试使用其他关键词搜索"}),s&&e.jsx("button",{onClick:y,className:"clear-search-btn",children:"查看所有图片"})]})}),h&&e.jsxs("div",{className:"load-more-container",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"正在加载更多图片..."})]}),!x&&d.length>0&&e.jsx("div",{className:"no-more-container",children:e.jsx("p",{children:"已经到底了~"})})]}),C&&e.jsx("button",{className:"scroll-top-btn",onClick:H,title:"返回顶部",children:"↑"})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})}export{P as default};
