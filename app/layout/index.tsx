import Header from "~/components/header";
import HistorySheet from "~/components/sheet";

type User = {
  name: string;
  avatarUrl: string;
};

export default function HomeLayout({
  userId,
  user,
  messageHistory,
  children,
}: {
  userId?: string;
  user?: User;
  messageHistory?: any;
  children: React.ReactNode;
}) {
  return (
    <main className="relative w-full">
      <Header user={user} />
      <div className="mx-5 md:mx-40">
        {userId && user && messageHistory && (
          <HistorySheet messageHistory={messageHistory} />
        )}
      </div>

      <div className="w-full">{children}</div>
    </main>
  );
}
