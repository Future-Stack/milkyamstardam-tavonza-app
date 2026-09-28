 import SignIn from "./signin/signin";

 
export default function HomePage() {
  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 text-white font-sans">
      {/* <h1 className="text-4xl font-bold">Tavonza Web</h1> */}
       <SignIn/>
 
      {/* <p className="text-zinc-400 mt-4">Landing page placeholder.</p> */}
    </main>
  );
}
