import { useState } from "react";
// import HeroComponent from "../components/HeroComponent";
import ImageCarousel from "../components/imageCarousel";

const LandingPage = () => {
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    return (
        <>
            <>
                {/* <img src="/images/other/pro-shirt.png" width="250" height="250" className="centerImage" /><br /> */}
                {/* <HeroComponent /> */}
                <ImageCarousel currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex}/>
                <>
                    <div className="container" >
                        <div>Company name: </div>
                        <div>Webshop pro</div>
                        <div>Areacode: </div>
                        <div>6969PP</div>
                        <div>Place: </div>
                        <div>Klooster</div>
                        <div>Telephone number:</div>
                        <div>0694206721</div>
                        <div>Email:</div>
                        <div>webshop@notAscam.gh</div>
                    </div>
                    <img src="/images/other/logo.png" width={"100"} height={"100"}/>
                </>
            </>
        </>
    )
}

export default LandingPage;