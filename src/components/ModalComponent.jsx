import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { toggleForm } from "../Redux/Modals";

export default function ModalComponent({ innerJsx, modalTitle, hidden }) {
    
  const [small, setSmall] = useState(true);

  return (
    <Modal
      show={hidden}
      centered
      className="modalwrapper"
      size={small ? "md" : "lg"}
    >
      <Modal.Header className="border-0">
        <Modal.Title>{modalTitle}</Modal.Title>
        <Button variant="none" onClick={() => setSmall((prev) => !prev)}>
          {small ? <AiOutlineFullscreen /> : <AiOutlineFullscreenExit />}
        </Button>
      </Modal.Header>
      <Modal.Body>{innerJsx}</Modal.Body>
    </Modal>
  );
}
