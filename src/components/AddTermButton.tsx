import React from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import AddTermModal from "./AddTermModal";

export default function AddTermButton() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <ButtonToolbar>
      <Button
        className="add-term-button"
        variant="secondary"
        onClick={() => setModalShow(true)}
      >
        ...or add your own
      </Button>
      <AddTermModal show={modalShow} onHide={() => setModalShow(false)} />
    </ButtonToolbar>
  );
}
