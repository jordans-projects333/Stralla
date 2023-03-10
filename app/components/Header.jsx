import svg_icon from '../../Images/svg_icon.png'
import Image from 'next/image'
import Link from 'next/link'
import NavLinks from './NavLinks'
import SearchBar from './SearchBar'
import BlurBackground from './BlurBackground'
// import Dropdown from './Dropdown'

export default function Header() {
  return (
    <header className="shadow-lg relative z-10">
        <div>
            <svg className="h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
            Stralla
            <div className='ml-auto'>admin</div>
        </div>
        <div className="flex">
            {/* <Dropdown/> */}
            <ul className="flex gap-2 ml-4">
                <li><Link href={'/ComponentLibrary/HomeFolder'}><NavLinks name={'Components'} link={'/ComponentLibrary'}/></Link></li>
                <li><Link href={'/Notes/HomeFolder'}><NavLinks name={'Notes'} link={'/Notes'}/></Link></li>
                <li>Api Keys</li>
                <li>Databases</li>
                <li><Link href={'/Deployments'}>Deployments</Link></li>
            </ul>
            <ul className='flex ml-auto'>
                <li><Link href={'/FontsLibrary'}><svg className="h-4"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M254 52.8C249.3 40.3 237.3 32 224 32s-25.3 8.3-30 20.8L57.8 416H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32h-1.8l18-48H303.8l18 48H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H390.2L254 52.8zM279.8 304H168.2L224 155.1 279.8 304z"/></svg></Link></li>
                <li><Link href={'/SvgLibrary'}><Image alt='svg icon' src={svg_icon} className='w-4 h-4'/></Link></li>
                <li><svg className="h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg></li>
            </ul>
        </div>
        <BlurBackground/>
        <SearchBar/>
    </header>
  )
}