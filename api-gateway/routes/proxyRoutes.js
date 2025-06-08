import proxy from "express-http-proxy";
import dotenv from "dotenv";
dotenv.config();

export const userProxy = proxy(process.env.USER_SERVICE_URL, {
  proxyReqPathResolver: (req) => req.originalUrl.replace("/user", ""),
  proxyReqBodyDecorator: (body, req) => {
    return body;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    const cookies = proxyRes.headers["set-cookie"];
    if (cookies) {
      userRes.setHeader("set-cookie", cookies);
    }
    return proxyResData;
  },
});

export const adminProxy = proxy(process.env.ADMIN_SERVICE_URL, {
  proxyReqPathResolver: (req) => req.originalUrl.replace("/admin", ""),
  proxyReqBodyDecorator: (body, req) => {
    return body;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    const cookies = proxyRes.headers["set-cookie"];
    if (cookies) {
      userRes.setHeader("set-cookie", cookies);
    }
    return proxyResData;
  },
});

export const varificationProxy = proxy(process.env.VERIFICATION_SERVICE_URL, {
  proxyReqPathResolver: (req) => req.originalUrl.replace("/verification", ""),
  proxyReqBodyDecorator: (body, req) => {
    return body;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    const cookies = proxyRes.headers["set-cookie"];
    if (cookies) {
      userRes.setHeader("set-cookie", cookies);
    }
    return proxyResData;
  },
});

export const projectProxy = proxy(process.env.PROJECT_SERVICE_URL, {
  proxyReqPathResolver: (req) => req.originalUrl.replace("/project", ""),
  proxyReqBodyDecorator: (body, req) => {
    return body;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    const cookies = proxyRes.headers["set-cookie"];
    if (cookies) {
      userRes.setHeader("set-cookie", cookies);
    }
    return proxyResData;
  },
});
