import axios from "axios";
import { useNavigate } from "react-router";
import { BrainCircuitIcon, CircleDollarSignIcon } from "lucide-react";
import { useAtom } from "jotai";
import { userAtom } from "@/jotai/atoms";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Avatar, AvatarBadge, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const Navbar = () => {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true },
      );
      if (response.status === 200) {
        setUser(null);
        navigate("/");
      }
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
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-2 rounded-lg">
            <BrainCircuitIcon size={20} />
          </div>
          <h2 className="font-semibold text-lg hidden sm:block">
            Interview.AI
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-all ">
                <CircleDollarSignIcon size={18} />
                <p>{user ? user.credits : 0}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 mt-3 -ml-12">
              <div className="flex flex-col items-center gap-4 p-4">
                <p className="text-sm text-muted-foreground">
                  Need more credits to continue interviews ?
                </p>
                <Button className="w-full" onClick={() => navigate("/pricing")}>
                  Buy Credits
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {user ? (
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
                          src={user.photoUrl}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                        />
                        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 mt-3 -ml-12">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer">
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Interview History
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        variant="destructive"
                        className="cursor-pointer"
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
              className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 text-sm font-medium"
            >
              Login
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
