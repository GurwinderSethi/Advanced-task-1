import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';

// Number of talents fetched per request.
const LOAD_NUMBER = 5;

export default function TalentFeed() {
    const [loader, setLoader] = useState(() => {
        const initialLoader = TalentUtil.deepCopy(loaderData);
        initialLoader.allowedUsers.push("Employer");
        initialLoader.allowedUsers.push("Recruiter");
        return initialLoader;
    });
    const [feedData, setFeedData] = useState([]);
    const [loadingFeedData, setLoadingFeedData] = useState(false);
    const [companyDetails, setCompanyDetails] = useState(null);

    // Paging state lives in a ref so the scroll listener (attached once) always sees current values.
    const paging = useRef({ position: 0, loading: false, hasMore: true });

    const init = () => {
        const newLoader = TalentUtil.deepCopy(loader);
        newLoader.isLoading = false;
        setLoader(newLoader);
    };

    const loadCompanyDetails = () => {
        const cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: TalentApi.profile + '/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: res => {
                if (res.success && res.employer) {
                    setCompanyDetails(res.employer.companyContact);
                }
            },
            error: res => console.log(res)
        });
    };

    const loadFeedData = () => {
        // Skip if a request is already in flight or there's nothing left to load.
        if (paging.current.loading || !paging.current.hasMore) {
            return;
        }
        paging.current.loading = true;
        setLoadingFeedData(true);

        const cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: TalentApi.profile + '/profile/profile/getTalent',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: {
                position: paging.current.position,
                number: LOAD_NUMBER
            },
            success: res => {
                if (res.success) {
                    const newTalents = res.data || [];
                    paging.current.position += newTalents.length;
                    paging.current.hasMore = newTalents.length === LOAD_NUMBER;
                    setFeedData(previous => previous.concat(newTalents));
                } else {
                    paging.current.hasMore = false;
                    TalentUtil.notification.show("Couldn't load talent feed", "error", null, null);
                }
            },
            error: res => {
                paging.current.hasMore = false;
                console.log(res);
            },
            complete: () => {
                paging.current.loading = false;
                setLoadingFeedData(false);
            }
        });
    };

    useEffect(() => {
        // Load the next batch when the user scrolls near the bottom of the page.
        const handleScroll = () => {
            const nearBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 200;
            if (nearBottom) {
                loadFeedData();
            }
        };

        window.addEventListener('scroll', handleScroll);
        init();
        loadCompanyDetails();
        loadFeedData();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const renderFeed = () => {
        if (feedData.length === 0 && !loadingFeedData) {
            return <p>There are no talents found for your recruitment company</p>;
        }

        return (
            <div>
                {feedData.map(talent => <TalentCard key={talent.id} talent={talent} />)}
                <Loader active={loadingFeedData} inline='centered' />
            </div>
        );
    };

    return (
        <BodyWrapper reload={init} loaderData={loader}>
            <div className="ui container">
                <div className="ui grid talent-feed">
                    <div className="four wide column">
                        <CompanyProfile companyDetails={companyDetails} />
                    </div>
                    <div className="eight wide column">
                        {renderFeed()}
                    </div>
                    <div className="four wide column">
                        <div className="ui card">
                            <FollowingSuggestion />
                        </div>
                    </div>
                </div>
            </div>
        </BodyWrapper>
    );
}
