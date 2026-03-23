const TopBar = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userName = user && user.firstName ? user.firstName : '';

  return (
    <div className="bg-indigo-600 text-white text-center py-2 text-sm flex items-center justify-center gap-2">
      {userName ? (
        <span>Welcome, {userName}!</span>
      ) : (
        <span>Get free delivery on orders above ₹500</span>
      )}
    </div>
  );
};

export default TopBar;
