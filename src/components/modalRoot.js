import React from 'react';
import { ModalConsumer } from './modalContext';

const ModalRoot = () => (
  <ModalConsumer>
    {({ component: Component, props, hideModal }) => (
      Component ? <Component {...props} onRequestClose={hideModal} /> : null
    )}
  </ModalConsumer>
);

export default ModalRoot;

// componentDidUpdate(prevProps) {
//   const { modal } = this.props;

//   /*
//    We use setstate here to force the component to unmount within 300ms to prevent animations from breaking,
//    and to make sure the modal is fully destroyed
//   */
//   if (prevProps.modal.visible !== modal.visible && modal.visible) {
//     // eslint-disable-next-line react/no-did-update-set-state
//     this.setState({ modalVisible: modal.visible });
//   }

//   if (prevProps.modal.visible !== modal.visible && !modal.visible) {
//     // eslint-disable-next-line react/no-did-update-set-state
//     setTimeout(() => this.setState({ modalVisible: modal.visible }), 300);
//   }
// }
