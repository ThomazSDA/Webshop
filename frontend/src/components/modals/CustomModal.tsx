
import type { ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";

interface CustomModalProps {
    title: string;
    children: ReactNode;
    handleSubmit: () => void;
    show: boolean;
    setShow: (show: boolean) => void;
}

const CustomModal = ({
    title,
    children,
    handleSubmit,
    show,
    setShow
}: CustomModalProps) => {
    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {children}
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setShow(false)}
                >
                    Return
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                >
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomModal;


// import { Children } from "react";
// import { Button, Modal } from "react-bootstrap"

// interface modalProps {
//     title: string;
//     children: React.ReactNode;
//     handleSubmit: () => void;
//     show: boolean;
//     setShow: (arg0: boolean) => void;
// }

// const CustomModal = ({ title, children, handleSubmit, show , setShow }: modalProps) => {

//     return (
//         <>
//             <Modal
//                 show={show}
//                 // backdrop="static"
//                 // keyboard={false}
//                 style={{ width: "100%", height: "30vw", overflow: "scroll"}}
//             >
//                 <Modal.Header>
//                     <Modal.Title>{title}</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <div className="RowList">
//                     {Children.map(children, child =>
//                         <div className="Row">
//                             {child}
//                         </div>
//                     )}
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button as="input" variant="secondary" defaultValue="Return" onClick={()=>setShow(false)}>

//                     </Button>
//                     <Button as="input" variant="primary" defaultValue="Confirm" onClick={() => {
//                                  handleSubmit()
//                                 //  setShow(false) //Do not hide automatically, wait until there's no errors
//                                  }} />
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );

// }

// export default CustomModal