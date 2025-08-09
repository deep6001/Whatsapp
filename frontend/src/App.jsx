import Sidebar from './Components/Sidebar';
import ChatSection from './Components/ChatSection';
import { useViewStore } from './store/store';

function App() {
  const { showChat } = useViewStore();

  return (
    // Make the root a flex container only for desktop
    <div className="App h-screen w-full overflow-hidden relative md:flex">
      
      {/* Sidebar */}
      <div
        className={`
          h-full w-full md:w-[380px]
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${showChat ? 'translate-x-[-100%]' : 'translate-x-0'}
          md:relative md:block absolute top-0 left-0
        `}
      >
        <Sidebar />
      </div>

      {/* Chat Section */}
      <div
        className={`
          h-full w-full md:flex-1
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${showChat ? 'translate-x-0' : 'translate-x-full'}
          md:relative md:block absolute top-0 left-0
        `}
      >
        <ChatSection />
      </div>
    </div>
  );
}

export default App;
