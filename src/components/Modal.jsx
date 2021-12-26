import classes from "../styles/Modal.module.css";

const Modal = ({visible = false, title = '', content = '', footer = '', onClose}) => {

    // если компонент невидим, то не отображаем его
    if (!visible) return null

    // TODO: rework Modal for forms
    return (
        <div className={classes.modal} onClick={onClose}>
            <div className={classes.modalDialog} onClick={e => e.stopPropagation()}>
                <div className={classes.modalHeader}>
                    <h3 className={classes.modalTitle}>{title}</h3>
                </div>
                <div className={classes.modalBody}>
                    {content}
                </div>
                {footer && <div className={classes.modalFooter}>{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;