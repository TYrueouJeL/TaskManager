import {Link} from "react-router";

export default function TaskDetail({ task }) {
    if (!task) {
        return <div>Task not found</div>
    }

    return (
        <>
            <h1 className={"title"}>Détail de la tâche : {task.title}</h1>

            <div className="flex flex-row gap-4">
                <article className={`article-state flex-1 ${task.validationDate != null ? 'card-button--completed' : (new Date(task.dueDate) < new Date() ? 'card-button--failed' : 'card-button--pending')}`}>
                    <p>État : Tâche
                        {new Date(task.dueDate) < new Date() ?
                            ' en retard' : (
                                task.completed ? ' complétée' : ' en cours'
                            )
                        }
                    </p>
                </article>

                <article className={"article flex-1"}>
                    <p>Date limite : {new Date(task.dueDate).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
                </article>

                <article className={"article flex-1"}>
                    <p>Date de validation : {task.validationDate != null ? new Date(task.validationDate).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'}) : "pas encore validé"}</p>
                </article>
            </div>

            <button><Link to={`/task`} className={"navigation-button"}>Retour</Link></button>
        </>
    );
}