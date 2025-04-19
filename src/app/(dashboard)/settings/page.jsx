
import EditUnpaidStudent from "@/components/EditPayment";
import UpdateSessionCard from "@/components/UpdateSessioncard";
import { getUserRole } from "@/lib/authUtils";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ResumptionDate from "@/components/ResumptionDate";


const settingPage = async() => {
    const { userId } = await auth();
  
    if (!userId) {
      redirect("/sign-in");
    }
      const role = await getUserRole(); // get the user role from Clerk
      if (!role) {
        redirect(`${role}`);
    
      }
  

    const session = await prisma.session.findFirst({
        where: {
          isCurrent: true,
        },
      });
     console.log(session)
    
  return (
    <div className="mt-10">
      <h1 className="text-center font-bold">SETTING PAGE</h1>
      <UpdateSessionCard session={session} />

      <div className="mt-4">
      <h1 className="text-center font-bold">UPDATE PAYMENT FOR PAST TERMS</h1>
        <EditUnpaidStudent />
      </div>


      <div className="mt-4">
      <h1 className="text-center font-bold">UPDATE RESUMPTION DATE</h1>
        <ResumptionDate/>
      </div>
      
    </div>
  );
};

export default settingPage;
