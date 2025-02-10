import Image from "next/image";
import Link from "next/link";
import useLogout from "@/hooks/useLogout";
const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/admin",
        visible: "ADMIN",
      },
      {
        icon: "/subject.png",
        label: "Gestion d'examens",
        href: "/list/exams",
        visible: "ADMIN",
      },
      {
        icon: "/class.png",
        label: "Gestion des salles",
        href: "/list/salles",
        visible: "ADMIN",
      },
      {
        icon: "/student.png",
        label: "Gestion surveillants",
        href: "/list/surveillants",
        visible: "ADMIN",
      },
      {
        icon: "/approved.png",
        label: "Valider planning",
        href: "/chef",
        visible: "CHEF",
      },
      {
        icon: "/user.png",
        label: "Valider étudiants",
        href: "/",
        visible: "CHEF",
      },
    ]
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/logout.png",
        label: "Logout",
      },
    ],
  },
];

interface MenuProps {
  role: string;
}

const Menu = ({ role }: MenuProps) => {
  const logout = useLogout();
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if(item.label==="Logout"){
              return (
                <button
                  onClick={logout}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-1 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </button>
              );
            }
            else if ('visible' in item && item.visible === role) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-1 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
