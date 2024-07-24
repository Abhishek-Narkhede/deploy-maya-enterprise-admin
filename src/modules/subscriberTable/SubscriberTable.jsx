import React, { useState } from 'react';
import { Table, Button, Pagination, Loader, Input } from 'semantic-ui-react';
import DeleteSubscriberModal from '../../modals/subscriberModal/DeleteSubscriberModal';
import UpdateSubscriberModal from '../../modals/subscriberModal/UpdateSubscriberModal';
import { apiDELETE, apiPOST, apiPUT } from '../../utils/apiHelper';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const SubscriberTable = ({ subscribers, onAddSubscriber, currentPage, totalPages, onPageChange, loading, fetchSubscriber, subscribed, handleToggle, seacrhQuery, handleSearch, setSubscriber }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedSubscriber, setSelectedSubscriber] = useState(null);

    const handleDeleteCategories = async (item) => {
        console.log("item", item);
        Swal.fire({
            title: "Proceed to Unsubscribe this user?",
            text: "This will unsubscribe the email from this platform",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes Proceed!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                // const updatePayload = {
                //     email: item?.userDetails?.email,
                //     isActive: false,
                //     isEmailSubscribed: false
                // }
                // const response = await apiPUT(`v1/email-subscribe/update-by-user/${item?.userDetails._id}`, updatePayload);
                const response = await apiDELETE(`v1/email-subscribe/delete-by-userId/${item?.userDetails._id}`);
                if (response?.status) {
                    const payload = {
                        "page": currentPage,
                        "limit": 10,
                        "searchQuery": seacrhQuery
                    }
                    const getResponse = await apiPOST(`v1/email-subscribe/get-all`, payload);
                    if (getResponse?.status) {
                        toast.success('Email Unsubscribed Successfully!')
                        console.log("response?.data?.data?.data", getResponse?.data?.data?.data);
                        setSubscriber(getResponse?.data?.data?.data)
                    }
                }
            }
        });


        // setDeleteModalOpen(true);
        // setSelectedSubscriber(item);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedSubscriber(null);
        fetchSubscriber()
    };
    const handleUpdateCategories = (item) => {
        setUpdateModalOpen(true);
        setSelectedSubscriber(item);
    };

    const closeUpdateModal = () => {
        setUpdateModalOpen(false);
        setSelectedSubscriber(null);
        fetchSubscriber()
    };


    return (
        <div className='w-full px-4'>
            <div className='flex  gap-5 items-center mt-4'>
                <div><Input placeholder="Serach by name or email" value={seacrhQuery} onChange={handleSearch} /></div>
                {/* <div className='w-full items-center flex justify-between'>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={subscribed}
                            onChange={handleToggle}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900">
                            {subscribed ? 'Unsubscribers' : 'Subscribers'}
                        </span>
                    </label>
                    <Button className='' primary onClick={onAddSubscriber}>Add Subscriber</Button>
                </div> */}
            </div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                {loading ? (
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell colSpan='4' textAlign='center'>
                                <Loader active inline='centered' />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                ) : (
                    <Table.Body>
                        {subscribers?.length ? subscribers?.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>{item?.userDetails?.name}</Table.Cell>
                                <Table.Cell>{item?.userDetails?.email}</Table.Cell>
                                <Table.Cell>
                                    {/* <Button positive icon='edit' onClick={() => handleUpdateCategories(item)} /> */}
                                    <Button negative icon='delete' onClick={() => handleDeleteCategories(item)} />
                                </Table.Cell>
                            </Table.Row>
                        )) : (
                            <Table.Row>
                                <Table.Cell colSpan='4' textAlign='center'>
                                    No subscribers found
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                )}

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='6'>
                            <Pagination
                                activePage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
            {deleteModalOpen && (
                <DeleteSubscriberModal
                    deleteModalOpen={deleteModalOpen}
                    deleteModalClose={closeDeleteModal}
                    selectedSubscriber={selectedSubscriber}
                />
            )}
            {updateModalOpen && (
                <UpdateSubscriberModal
                    updateModalOpen={updateModalOpen}
                    updateModalClose={closeUpdateModal}
                    selectedSubscriber={selectedSubscriber}
                />
            )}
        </div>
    );
};

export default SubscriberTable;
