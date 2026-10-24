import {getContent} from '../sanity/content';import HomeClient from './home-client';
export default async function Home(){const content=await getContent();return <HomeClient {...content}/>}
