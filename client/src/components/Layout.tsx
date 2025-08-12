// Layout.tsx
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Top Navbar */}
      <nav className='bg-white shadow px-6 py-3 flex justify-between items-center'>
        <div className='text-xl font-bold text-blue-600'>MySocial</div>
        <div className='flex items-center gap-4'>
          <button className='text-gray-700 hover:text-blue-600'>Profile</button>
          <button className='text-gray-700 hover:text-blue-600'>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className='grid grid-cols-12 gap-4 px-6 py-6'>
        {/* Left Sidebar */}
        <aside className='col-span-3 hidden lg:block'>
          <div className='bg-white rounded-lg shadow p-4 space-y-2'>
            <button className='block w-full text-left text-gray-700 hover:text-blue-600'>
              🏠 Home
            </button>
            <button className='block w-full text-left text-gray-700 hover:text-blue-600'>
              👤 Profile
            </button>
            <button className='block w-full text-left text-gray-700 hover:text-blue-600'>
              👥 Friends
            </button>
          </div>
        </aside>

        {/* Feed */}
        <main className='col-span-12 lg:col-span-6'>{children}</main>

        {/* Right Sidebar */}
        <aside className='col-span-3 hidden xl:block'>
          <div className='bg-white rounded-lg shadow p-4'>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
              Trending
            </h3>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>#GraphQL</li>
              <li>#TypeScript</li>
              <li>#TailwindCSS</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Layout;
