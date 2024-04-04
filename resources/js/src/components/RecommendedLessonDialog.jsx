import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Galleria } from "primereact/galleria";
import { Button } from "primereact/button";

const RecommendedLessonDialog = ({ visible, handleOnHide, lessons }) => {
    const navigate = useNavigate();

    const itemTemplate = (item) => {
        return (
            <div className="tw-flex tw-flex-col tw-gap-3 tw-items-center">
                <img
                    src={item.preview_image}
                    alt={item.title}
                    style={{ width: "100%", display: "block" }}
                />
                <Button
                    outlined
                    label="Play"
                    onClick={() => navigate(`view/${item.id}`)}
                />
            </div>
        );
    };

    return (
        <Dialog
            visible={visible}
            onHide={handleOnHide}
            header="Please see below the list of recommended courses"
        >
            <Galleria
                value={lessons}
                numVisible={5}
                circular
                style={{ maxWidth: "640px" }}
                showThumbnails={false}
                showItemNavigators
                item={itemTemplate}
            />
        </Dialog>
    );
};

export default RecommendedLessonDialog;
