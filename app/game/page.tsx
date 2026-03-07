import RunnerGame from '../components/RunnerGame';

export default function GamePage() {
  return (
    <div className="min-h-screen bg-[#04111F] flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center mb-4">
        <p className="text-[10px] font-bold tracking-widest uppercase text-[#72C4E8]/60 mb-1">Fan Game</p>
        <h1 className="text-2xl font-black text-white tracking-tight">mhaymhey Runner</h1>
      </div>
      <RunnerGame />
    </div>
  );
}
