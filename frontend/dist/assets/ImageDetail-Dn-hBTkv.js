import{j as e}from"./index-BzI7mAnA.js";import{d as p,e as x,r as i}from"./react-vendor-BNorfeeT.js";import{N as n}from"./Navbar-B9R7PAw_.js";import{a as g}from"./api-9C_kg36F.js";function v(){const{id:o}=p(),s=x(),[a,d]=i.useState(null),[c,r]=i.useState(!0),[l,m]=i.useState(null);return i.useEffect(()=>{(async()=>{try{r(!0);const t=await g(o);d(t)}catch(t){m("Failed to load image"),console.error("Error loading image:",t)}finally{r(!1)}})()},[o]),c?e.jsxs("div",{children:[e.jsx(n,{}),e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"70vh"},children:e.jsx("p",{children:"加载中..."})})]}):l||!a?e.jsxs("div",{children:[e.jsx(n,{}),e.jsxs("div",{style:{maxWidth:"800px",margin:"40px auto",padding:"20px"},children:[e.jsx("h1",{children:"图片加载失败"}),e.jsx("p",{children:l||"图片不存在或已被删除"}),e.jsx("button",{onClick:()=>s("/"),style:{backgroundColor:"#4a90e2",color:"white",border:"none",borderRadius:"8px",padding:"12px 24px",cursor:"pointer",fontSize:"16px",fontWeight:"500",marginTop:"20px"},children:"返回首页"})]})]}):e.jsxs("div",{className:"image-detail-wrapper",children:[e.jsx(n,{}),e.jsxs("div",{className:"image-detail-container",children:[e.jsx("div",{className:"image-main",children:e.jsx("div",{className:"image-display",children:e.jsx("img",{src:a.url,alt:a.title,className:"detail-image"})})}),e.jsxs("div",{className:"image-info-panel",children:[e.jsxs("div",{className:"info-section",children:[e.jsx("h1",{className:"image-title",children:a.title}),e.jsx("p",{className:"image-description",children:a.description||"无描述"})]}),e.jsxs("div",{className:"info-section metadata",children:[e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"info-label",children:"创建人:"}),e.jsx("span",{className:"info-value",children:a.username||"未知用户"})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"info-label",children:"尺寸:"}),e.jsxs("span",{className:"info-value",children:[a.width," × ",a.height," 像素"]})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"info-label",children:"上传时间:"}),e.jsx("span",{className:"info-value",children:new Date(a.created_at).toLocaleString()})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"info-label",children:"文件名称:"}),e.jsx("span",{className:"info-value",children:a.filename})]})]}),e.jsxs("div",{className:"action-buttons",children:[e.jsx("button",{className:"back-button",onClick:()=>s("/"),children:"返回画廊"}),e.jsx("button",{className:"download-button",onClick:()=>window.open(a.url,"_blank"),children:"查看原图"})]})]})]}),e.jsx("style",{jsx:!0,children:`
        .image-detail-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        }
        
        .image-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 40px;
          align-items: start;
        }
        
        /* 图片主体 */
        .image-main {
          background-color: #2d2d2d;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        
        .image-display {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #000000;
          border-radius: 8px;
          overflow: hidden;
          min-height: 400px;
        }
        
        .detail-image {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
        }
        
        /* 图片信息面板 */
        .image-info-panel {
          background-color: #2d2d2d;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          position: sticky;
          top: 100px;
        }
        
        .info-section {
          margin-bottom: 30px;
        }
        
        .info-section:last-child {
          margin-bottom: 0;
        }
        
        .image-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #ffffff 0%, #4a90e2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .image-description {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #cccccc;
          margin: 0;
          white-space: pre-line;
        }
        
        /* 元数据 */
        .metadata {
          background-color: #353535;
          padding: 20px;
          border-radius: 8px;
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #4a4a4a;
        }
        
        .info-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .info-label {
          font-size: 14px;
          font-weight: 500;
          color: #888888;
        }
        
        .info-value {
          font-size: 14px;
          color: #ffffff;
          text-align: right;
        }
        
        /* 操作按钮 */
        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }
        
        .back-button,
        .download-button {
          flex: 1;
          padding: 14px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .back-button {
          background-color: #404040;
          color: #ffffff;
        }
        
        .back-button:hover {
          background-color: #505050;
          transform: translateY(-1px);
        }
        
        .download-button {
          background-color: #4a90e2;
          color: #ffffff;
        }
        
        .download-button:hover {
          background-color: #357abd;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
        }
        
        /* 响应式设计 */
        @media (max-width: 1024px) {
          .image-detail-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .image-info-panel {
            position: static;
          }
        }
        
        @media (max-width: 768px) {
          .image-detail-container {
            padding: 20px 16px;
          }
          
          .image-title {
            font-size: 1.8rem;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `})]})}export{v as default};
