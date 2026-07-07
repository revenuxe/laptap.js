import { createStart } from "@tanstack/react-start";
import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = async ({ next }: { next: () => Promise<Response> }) => {
  try {
    return await next();
  } catch (error: any) {
    if (error?.statusCode) throw error;
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
};

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware as any],
}));
