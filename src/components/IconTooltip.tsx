import { Tooltip, IconButton, IconButtonProps } from "@mui/material";
import { ReactNode } from "react";

interface IconTooltipProps extends IconButtonProps {
    title: string;
    children: ReactNode;
}

export default function IconTooltip({ title, children, ...props }: IconTooltipProps) {
    return (
        <Tooltip title={title} arrow placement="top">
            <IconButton {...props}>
                {children}
            </IconButton>
        </Tooltip>
    );
}
