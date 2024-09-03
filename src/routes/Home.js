import './Home.css'


export function Home() {
    return (
        <div id="Home">
            <div className="cont_video pore">
                <video autoPlay muted loop className="posa_cent">
                    <source src="/vid/mainmv.mp4"/>
                </video>
            </div>
        </div>
    );
};