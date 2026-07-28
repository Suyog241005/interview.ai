import { useNavigate } from "react-router";
import { CircleDollarSignIcon } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@interview.ai/ui/button";
import { Avatar, AvatarBadge, AvatarImage } from "@interview.ai/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@interview.ai/ui/dropdown-menu";
import { signOut } from "@interview.ai/better-auth/client";
import { useSession } from "@interview.ai/better-auth/client";
import { trpc } from "@interview.ai/api/client";

export const Navbar = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const { data: candidate } = trpc.candidate.getCandidate.useQuery(undefined, {
    enabled: !!user,
  });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center px-4 pt-6 bg-[#F3F3F3]">
      <motion.div
        initial={{ opacity: 0.8, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeOut" }}
        className="w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative"
      >
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/icon.png"
            alt="Interview.AI Logo"
            className="w-8 h-8 object-contain"
          />
          <h2 className="font-semibold text-lg hidden sm:block">
            Interview.AI
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-all font-semibold text-gray-700">
                <CircleDollarSignIcon size={18} className="text-amber-500" />
                <p>{candidate?.credits ?? 0}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 mt-3 -ml-12">
              <div className="flex flex-col items-center gap-4 p-4">
                <p className="text-sm text-muted-foreground text-center">
                  Need more credits to continue interviews?
                </p>
                <Button className="w-full" onClick={() => navigate("/pricing")}>
                  Buy Credits
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {isPending ? (
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse shrink-0" />
          ) : user ? (
            <>
              <div className="flex items-center gap-2 pr-6 rounded-full cursor-pointer">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full cursor-pointer"
                    >
                      <Avatar>
                        <AvatarImage
                          src={user.image || ""}
                          alt={user.name || "User Profile"}
                          referrerPolicy="no-referrer"
                        />
                        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 mt-3 -ml-12">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => navigate("/history")}
                        className="cursor-pointer font-medium"
                      >
                        Interview History
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        variant="destructive"
                        className="cursor-pointer font-medium"
                      >
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 text-sm font-medium cursor-pointer"
            >
              Login
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
