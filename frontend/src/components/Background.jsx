import "../styles/animations.css";

function Background(){

    return(

        <div className="absolute inset-0 overflow-hidden -z-10">

            <div className="aurora top-[-250px] left-[-150px]"/>

            <div
                className="aurora bottom-[-300px] right-[-150px]"
                style={{
                    animationDelay:"-10s"
                }}
            />

        </div>

    )

}

export default Background;