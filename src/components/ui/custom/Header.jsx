import React, { useState, useEffect } from "react";
import { Button } from '../button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

function Header() {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      console.log("Login success", codeResp);
      GetUserProfile(codeResp);
    },
    onError: (error) => console.log("Login error", error),
  });

  const GetUserProfile = async (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    }).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data));
      setUser(resp.data); // 🔥 Update state
      setOpenDialog(false);
    });
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null); // 🔥 Reset state
  };

  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-4'>
      <img src='/logo.svg' className='h-20 w-18' />
      <div>
        {user ? (
          <div className='flex items-center gap-4'>
            <a href="/features">
            <Button variant='outline' className='rounded-full bg-red-500'>Features</Button></a>
            <a href="/">
             <Button variant='outline' className='rounded-full bg-red-500'>Home</Button></a>
            <a href="/create-trip">
             <Button variant='outline' className='rounded-full'>Create Trip</Button></a>
            <a href="/My-trips">

            <Button variant='outline' className='rounded-full'>My Trip</Button></a>
            <Popover>
              <PopoverTrigger>
                <img src='/placeholder.jpg'className='h-[35px] w-[35px] rounded-full' />
              </PopoverTrigger>
              <PopoverContent className='p-2'>
                <Button variant='destructive' onClick={handleLogout}>Logout</Button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              <img src="/logo.svg" className="h-20 w-20" />
              <h2 className="font-bold text-lg mt-3">Sign In with Google</h2>
              <p>Sign in to the App with Google authentication securely</p>
              <Button className="w-full mt-5 flex gap-4 items-center" onClick={login}>
                <FcGoogle className="h-7 w-7" />
                Sign In with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default Header;