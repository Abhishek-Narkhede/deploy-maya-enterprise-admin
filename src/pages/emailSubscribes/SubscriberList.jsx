import React, { useState, useEffect } from 'react';
import { apiPOST } from '../../utils/apiHelper';
import AddBrandsModal from '../../modals/brandsModal/AddBrandsModal';
import SubscriberTable from '../../modules/subscriberTable/SubscriberTable';
import AddSubscriberModal from '../../modals/subscriberModal/AddSubscriberModal';

const SubscriberList = () => {
  const [subscribers, setSubscriber] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [seacrhQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleToggle = () => {
    setSubscribed((prevSubscribed) => {
      const newSubscribedStatus = !prevSubscribed;
      fetchSubscriber(newSubscribedStatus);
      return newSubscribedStatus;
    });
  };

  const fetchSubscriber = async (isSubscribed) => {
    try {
      setLoading(true);
      const payload = {
        "page": currentPage,
        "limit": 10,
        "searchQuery": seacrhQuery
      }
      const endpoint = isSubscribed
        ? 'v1/email-subscribe/get-all'
        : 'v1/email-subscribe/get-all/unsubscriber';

      const response = await apiPOST(endpoint, payload);
      const subscriberData = response?.data?.data?.data;
      setSubscriber(subscriberData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };
  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  // useEffect(() => {
  //   const debouncedFetchSubscriber = debounce(() => fetchSubscriber(!subscribed), 300);
  //   debouncedFetchSubscriber();
  // }, [currentPage, subscribed, seacrhQuery]);
  useEffect(() => {
    fetchSubscriber(!subscribed)
    // const debouncedFetchSubscriber = debounce(() => fetchSubscriber(!subscribed), 300);
    // debouncedFetchSubscriber();
  }, [currentPage, subscribed, seacrhQuery]);
  return (
    <div>
      <SubscriberTable
        subscribers={subscribers}
        onAddSubscriber={() => setOpen(true)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        fetchSubscriber={fetchSubscriber}
        subscribed={subscribed}
        handleToggle={handleToggle}
        seacrhQuery={seacrhQuery}
        handleSearch={handleSearch}
        setSubscriber={setSubscriber}
      />
      <AddSubscriberModal
        open={open}
        onClose={() => setOpen(false)}
        refreshSubscriber={() => fetchSubscriber(subscribed)}
      />
    </div>
  );
};

export default SubscriberList;
