import React from "react";
import { Modal, Button, ModalProps } from "react-bootstrap";
import AddTermForm from "./AddTermForm";

export default function AddTermModal(props: ModalProps) {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add your own terminology
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddTermForm />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
