'use client'

const FontsPage = () => {
    const copyFont = (font, Font) => {
        navigator.clipboard.writeText(
            `import { ${Font} } from "@next/font/google"\n`+
            `const ${font} = ${Font}({subsets: ["latin"], weight: "400", variable: "--${font}-font"})\n`+
            '//layout.htmlTag className={`${'+font+'.variable}\n'+
            `//TailwindConfig theme.fontFamily '${font}' : 'var(--${font}-font)'`
        )
    }
    return (
      <div className="grid fadeIntro gridFont overflow-y-auto w-full gap-4 p-4 pt-6 pb-[20vh]">
          <div className=' aspect-[3/1] shadow flex items-center justify-center cursor-pointer font-robotoFont text-3xl' onClick={() => copyFont('roboto', 'Roboto')}>Roboto</div>
          <div className=' aspect-[3/1] shadow flex items-center justify-center cursor-pointer font-bodoniModaFont text-3xl' onClick={() => copyFont('bodoniModa', 'Bodoni_Moda')}>Bodoni Moda</div>
          <div className=' aspect-[3/1] shadow flex items-center justify-center cursor-pointer font-garamondFont text-3xl' onClick={() => copyFont('ebGaramond', ' EB_Garamond')}>Garamond</div>
          <div className=' aspect-[3/1] shadow flex items-center justify-center cursor-pointer font-openSans text-3xl' onClick={() => copyFont('openSans', 'Open_Sans')}>OpenSans</div>
          <div className=' aspect-[3/1] shadow flex items-center justify-center cursor-pointer font-lato text-3xl' onClick={() => copyFont('lato', 'Lato')}>Lato</div>
          <div className=' aspect-[3/1] shadow flex items-center justify-center cursor-pointer font-montserrat text-3xl' onClick={() => copyFont('montserrat', 'Montserrat')}>Montserrat</div>
          <div className=' aspect-[3/1] shadow flex items-center justify-center cursor-pointer font-prompt text-3xl' onClick={() => copyFont('prompt', 'Prompt')}>Prompt</div>
          <div className=' aspect-[3/1] shadow flex items-center justify-center cursor-pointer font-slabo text-3xl' onClick={() => copyFont('slabo', 'Slabo')}>Slabo</div>
          <div className=' aspect-[3/1] shadow flex items-center justify-center cursor-pointer font-playfairDisplay text-2xl' onClick={() => copyFont('playfairDisplay', 'Playfair_Display')}>Playfair Display</div>
          <div className=' aspect-[3/1] shadow flex items-center justify-center cursor-pointer font-cinzel text-3xl' onClick={() => copyFont('cinzel', 'Cinzel')}>Cinzel</div>
          <div className=' aspect-[3/1] shadow flex items-center justify-center cursor-pointer text-4xl font-italianno' onClick={() => copyFont('italianno', 'Italianno')}>Italianno</div>
          <div className=' aspect-[3/1] shadow flex items-center justify-center cursor-pointer font-ubuntu text-3xl' onClick={() => copyFont('ubuntu', 'Ubuntu')}>Ubuntu</div>
      </div>
    )
  }
  
  export default FontsPage