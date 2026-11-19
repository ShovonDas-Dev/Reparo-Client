'use client'

import { ServiceDetails } from '@/lib/API/service';
import { IService } from '@/lib/type';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ServiceDetailsPage = () => {
    
     const params = useParams();
  const id = params.id as string;

  const [service, setService] = useState<IService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getService = async () => {
      try {
        const data = await ServiceDetails(id);
        setService(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getService();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!service) return <p>Service not found!</p>;

  return (
    <div>
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      <p>Price: {service.basePrice}</p>
    </div>
  );
}

export default ServiceDetailsPage
