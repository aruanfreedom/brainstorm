import { useSelector } from "react-redux";

export const generatePushID = () => {
 const PUSH_CHARS =
   "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

 let lastPushTime = 0;
 const lastRandChars = [];

 return function () {
   let now = new Date().getTime();
   const duplicateTime = now === lastPushTime;
   lastPushTime = now;

   const timeStampChars = new Array(8);
   for (let i = 7; i >= 0; i--) {
     timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
     // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
     now = Math.floor(now / 64);
   }
   if (now !== 0)
     throw new Error("We should have converted the entire timestamp.");

   let id = timeStampChars.join("");

   let i;

   if (!duplicateTime) {
     for (i = 0; i < 12; i++) {
       lastRandChars[i] = Math.floor(Math.random() * 64);
     }
   } else {
     for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
       lastRandChars[i] = 0;
     }
     lastRandChars[i]++;
   }
   for (i = 0; i < 12; i++) {
     id += PUSH_CHARS.charAt(lastRandChars[i]);
   }
   if (id.length !== 20) throw new Error("Length should be 20.");

   return id;
 };
};

export const useGetId = () => {
    const path = location.pathname.split("/");
    const roomIdUrl = path[path.length - 1];
    const roomId = localStorage["roomId"];
    const users = useSelector((state) => state.users);

    return roomIdUrl || roomId || users.adminId;
}
