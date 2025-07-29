import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL,

});

export const api = {
    whiteSpaceAnalysis: {
        adEffectiveness: (params, signal) => instance.get("/white-space/ad-effectiveness", { params, signal }),
        lowCompetitionMarket: (params, signal) => instance.get("/white-space/low-competition-market", { params, signal }),
        brandList: (params, signal) => instance.get("/white-space/brands", { params, signal }),
    }
};

export const QueryKeys = {
    adEffectiveness: "AdEffectiveness",
    lowCompetitionMarket: "LowCompetitionMarket",
    brandList: "BrandList",
};

export const allParamsDefined = (params) => Object.values(params).every(Boolean);
