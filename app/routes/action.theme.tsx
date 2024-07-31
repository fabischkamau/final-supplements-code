
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  commitThemeSession,
  getThemeSession,
} from "~/utils/themesession.server"

export async function action({ request }: LoaderFunctionArgs) {
  const fomData = await request.formData();
  const theme = fomData.get("theme");
  const session = await getThemeSession(request.headers.get("Cookie"));

  if (typeof theme !== "string") {
    return {};
  }
  if (theme === "dark") {
    session.set("theme", "dark");
    return json(
      {},
      {
        headers: {
          "Set-Cookie": await commitThemeSession(session),
        },
      }
    );
  }
  session.set("theme", "light");
  return json(
    {},
    {
      headers: {
        "Set-Cookie": await commitThemeSession(session),
      },
    }
  );
}
