import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main
        style={{
          position: "fixed",
          top: "60px",            // height of Navbar
          left: "250px",          // width of Sidebar
          right: 0,
          bottom: 0,
          padding: "2rem",
          backgroundColor: "#f0f2f5",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </>
  );
};

export default MainLayout;
