import {Link, useLocation} from "react-router-dom";
import { AiOutlineHeart,AiOutlineUnorderedList} from "react-icons/ai";
import { HiOutlineHomeModern,HiOutlineListBullet } from "react-icons/hi2";

export default function AccountNav() {
  const {pathname} = useLocation();
  let subpage = pathname.split('/')?.[2];
  if (subpage === undefined) {
    subpage = 'profile';
  }
  function linkClasses (type=null) {
    let classes = 'inline-flex gap-1 py-2 px-6 rounded-full';
    if (type === subpage) {
      classes += ' bg-primary text-white';
    } else {
      classes += ' bg-gray-200';
    }
    return classes;
  }
  return (
    <div className="w-full flex justify-center mt-8 gap-2 mb-8 accountnavbar">
      <Link className={linkClasses('saved')} to={'/profile/saved'}>
        <AiOutlineHeart className="w-6 h-6"/>
        Saved
      </Link>
      <Link className={linkClasses('bookings')} to={'/profile/bookings'}>
       <AiOutlineUnorderedList className="w-6 h-6"/>
        My bookings
      </Link>
      <Link className={linkClasses('places')} to={'/profile/places'}>
        <HiOutlineHomeModern className="w-6 h-6"/>
        My hostings
      </Link>
      <Link className={linkClasses('bookedhosting')} to={'/profile/bookedhosting'}>
        <HiOutlineListBullet className="w-6 h-6"/>
        My bookedhosting
      </Link>
    </div>
  );
}