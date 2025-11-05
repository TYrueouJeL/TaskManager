import { Link } from 'react-router';
import { RiCheckLine, RiCloseLine, RiTimeLine } from 'react-icons/ri';

export default function TaskCard({ task }) {
    return (
        <Link to={`/task/${task.id}`}>
            <article className={`card-article ${task.validationDate != null ? 'card-article--completed' : (new Date(task.dueDate) < new Date() ? 'card-article--failed' : 'card-article--pending')}`}>
                <div className="flex flex-col">
                    <h2>{task.title}</h2>
                    <p className="text-sm text-gray-500">Date limite : {new Date(task.dueDate).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
                </div>
                {task.validationDate != null ?
                    <RiCheckLine className="text-green-500 ml-auto" /> :
                    (new Date(task.dueDate) < new Date() ?
                        <RiCloseLine className="text-red-500 ml-auto" /> :
                            <RiTimeLine className="text-yellow-500 ml-auto" />
                    )
                }
            </article>
        </Link>
    )
}