import {
	FaFacebook,
	FaInstagram,
	FaLinkedin,
	FaPinterest,
} from "react-icons/fa";
import { MdMail, MdPhone } from "react-icons/md";

export const iconMap: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	MdMail,
	MdPhone,
	FaInstagram,
	FaLinkedin,
	FaFacebook,
	FaPinterest,
};
