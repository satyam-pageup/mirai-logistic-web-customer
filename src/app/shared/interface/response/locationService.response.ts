export interface IStateDetails {
    name: string,
    country_id: number,
    country_code: string,
    fips_code: string,
    iso2: string,
    type: string,
    latitude: number,
    longitude: number,
}

export interface ICityDetails {
    id: number,
    name: string,
    state_id: number,
    state_code: string,
    country_id: number,
    country_code: string,
    latitude: number,
    longitude: number,
}

export interface ICountryDetails {
    name: string,
    iso2: string,
}

export interface IResponseState<T> {
    status: boolean,
    msg: string | null,
    data: T
}
