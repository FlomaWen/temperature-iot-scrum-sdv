/**
 * Component for displaying a share modal.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.selectedSensorDatas - The selected sensor data.
 * @param {string} props.currentURL - The current URL.
 * @returns {JSX.Element} The share modal component.
 */

const ShareModal = () => {

    return (
        <>

        <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg rounded-b-none" onClick={()=>document.getElementById('share_modal').showModal()}>Partager <span className="text-2xl">&#10149;</span></button>

        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <dialog id="share_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-2xl mb-6">Partagez cette statistique</h3>

                <kbd className="kbd text-xl">localhost:3000</kbd>

                <p className="py-4">Partagez notre application dès maintenant !</p>
                <div className="modal-action">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Fermer</button>
                </form>
                </div>
            </div>
        </dialog>

        </>
    );
};

export default ShareModal;





