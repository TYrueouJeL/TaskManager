import { Link } from 'react-router';

export default function ProjectCard({ project }) {
    return (
        <Link to={`/project/${project.id}`}>
            <article className={`card-button`}>
                <div className="flex flex-col">
                    <h2>{project.title}</h2>
                </div>
            </article>
        </Link>
    );
}