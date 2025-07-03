interface PageHeaderProps {
    title: string;
    description: string;
}

function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{title}</h1>
            <p className="text-slate-400 mt-2">{description}</p>
        </header>
    );
}

export default PageHeader;