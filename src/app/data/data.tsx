'use client'

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface parking {
    level : 1 | 2 | 3,
    parkInfo : {
        totalSpaces : number,
        normalSpaces : number,
        freeSpaces : number,
        electricSpaces : number,
        freeElSpaces : number
    }
    location : {
        lat : number,
        lng : number
    }
}

export function generateData({lat, lng} : {lat: number, lng: number}) {
    const data : parking[] = [];
    
    for(let i  = 0; i < randomInt(10, 15); i++){
        const pLat = lat + ((randomInt(-50, 50)) / 5000);
        const pLng = lng + ((randomInt(-50, 50)) / 5000);
        const level = randomInt(1, 3) as 1 | 2 | 3;
        const totalSpaces = randomInt(1, 50);
        const electricSpaces = totalSpaces > 15? randomInt(0, 5) : 0;
        const freeElSpaces = randomInt(0, 5);
        const normalSpaces = totalSpaces;
        const freeSpaces = randomInt(0, normalSpaces);

        data.push({
            level: level,
            parkInfo : {
                totalSpaces: totalSpaces,
                normalSpaces: normalSpaces,
                freeSpaces: freeSpaces,
                electricSpaces: electricSpaces,
                freeElSpaces: freeElSpaces
            },
            location : {
                lat: pLat,
                lng: pLng
            }
        })
    }
    return data;
}