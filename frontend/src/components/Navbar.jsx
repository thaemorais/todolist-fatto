export default function Navbar() {
	return (
		<nav className="flex items-center justify-around shadow-md py-4 bg-[#DB8A18] h-[78px] w-screen">
			<div className="notebook:justify-start notebook:max-w-[90%] monitor:max-w-[50%] flex items-center justify-center w-full">
				<h2 className="text-xl font-bold text-center text-white">Todo list</h2>
			</div>
		</nav>
	);
}
