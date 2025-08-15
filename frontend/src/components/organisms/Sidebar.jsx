// src/components/organisms/Sidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import {
    CalculatorIcon,
    ChartPieIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    KeyIcon,
    LanguageIcon,
    LinkIcon,
    PhotoIcon,
    PaintBrushIcon,
    EnvelopeIcon,
    DocumentMagnifyingGlassIcon,
    TableCellsIcon,
    WrenchIcon,
} from "@heroicons/react/24/outline";
import {
    DocumentArrowDownIcon,
    QrCodeIcon,
    SparklesIcon,
} from "@heroicons/react/24/solid";
import { BASE_ROUTE, ROUTES } from "../../constants";

const mainLinks = [
    { name: "Dashboard", path: ROUTES.DASHBOARD, icon: ChartPieIcon },
];

const toolLinks = [
    {
        name: "URL Shortener",
        path: `${BASE_ROUTE}${ROUTES.URL_SHORTENER}`,
        icon: LinkIcon,
    },
    {
        name: "File Compressor",
        path: `${BASE_ROUTE}${ROUTES.FILE_COMPRESSOR}`,
        icon: PhotoIcon,
    },
    {
        name: "File Converter",
        path: `${BASE_ROUTE}${ROUTES.FILE_CONVERTER}`,
        icon: DocumentArrowDownIcon,
    },
    {
        name: "BG Remover",
        path: `${BASE_ROUTE}${ROUTES.BACKGROUND_REMOVER}`,
        icon: SparklesIcon,
    },
    {
        name: "QR Code Tool",
        path: `${BASE_ROUTE}${ROUTES.QR_CODE_GENERATOR}`,
        icon: QrCodeIcon,
    },
    {
        name: "Summarizer",
        path: `${BASE_ROUTE}${ROUTES.DOCUMENT_SUMMARIZER}`,
        icon: DocumentTextIcon,
    },
    {
        name: "Password Manager",
        path: `${BASE_ROUTE}${ROUTES.PASSWORD_MANAGER}`,
        icon: KeyIcon,
    },
    {
        name: "Converter",
        path: `${BASE_ROUTE}${ROUTES.CURRENCY_CONVERTER}`,
        icon: CalculatorIcon,
    },
    {
        name: "Grammar Check",
        path: `${BASE_ROUTE}${ROUTES.GRAMMAR_CHECKER}`,
        icon: LanguageIcon,
    },
    {
        name: "Voice to Text",
        path: `${BASE_ROUTE}${ROUTES.VOICE_TO_TEXT}`,
        icon: ChatBubbleLeftRightIcon,
    },
    {
        name: "Color Tools",
        path: `${BASE_ROUTE}${ROUTES.COLOR_TOOLS}`,
        icon: PaintBrushIcon,
    },
    {
        name: "Temp Email",
        path: `${BASE_ROUTE}${ROUTES.TEMP_EMAIL}`,
        icon: EnvelopeIcon,
    },
    {
        name: "Metadata Inspector",
        path: `${BASE_ROUTE}${ROUTES.METADATA_INSPECTOR}`,
        icon: DocumentMagnifyingGlassIcon,
    },
    {
        name: "Fake Data Generator",
        path: `${BASE_ROUTE}${ROUTES.FAKE_DATA_GENERATOR}`,
        icon: TableCellsIcon,
    },
    {
        name: "Fake Data Generator",
        path: `${BASE_ROUTE}${ROUTES.REGEX_TESTER}`,
        icon: WrenchIcon,
    },
];

const Sidebar = () => (
    <aside className="w-64 bg-card p-4 border-r border-border hidden md:block">
        <div className="mb-8">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
                Overview
            </h2>
            <ul className="space-y-1">
                {mainLinks.map((link) => (
                    <li key={link.name}>
                        <NavLink
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-md text-primary-text transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-border"
                                }`
                            }
                        >
                            <link.icon className="h-5 w-5" />
                            {link.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>

        <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
                Tools
            </h2>
            <ul className="space-y-1">
                {toolLinks.map((link) => (
                    <li key={link.name}>
                        <NavLink
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-md text-primary-text transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-border"
                                }`
                            }
                        >
                            <link.icon className="h-5 w-5" />
                            {link.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    </aside>
);

export default Sidebar;
