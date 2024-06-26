'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import GoogleSignInButton from '../GoogleSignInButton';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const FormSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Vui lòng nhập tên tài khoản')
      .max(100),
    email: z
      .string()
      .min(1, 'Vui lòng nhập email')
      .email('Email không hợp lệ'),
    password: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu')
      .min(8, 'Mật khẩu cần có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu không trùng khớp',
  });

const SignUpForm = () => {
  const [buttonClicked, setButtonClicked] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    // console.log(values);

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        newUser: true
      })
    })

    setButtonClicked(true);
    if (response.ok) {
      const token = (await response.json()).token;
      if (!token || token === 'undefined' || token === 'null') {
        alert('Đăng kí thất bại, thử lại sau!');
        setButtonClicked(false);
        return;
      }
      alert('Đăng kí thành công, PickFood xin chào!');
      router.push('/onboarding')
      localStorage.setItem("token", token);
      // localStorage.setItem('itemName', value)
      // localStorage.getItem('itemName')
    } else {
      console.error('Registration failed')
    }
  };

  return (
    <div>
      <div className="header p-3 top-3">
        <p className="flex flex-wrap text-4xl font-semibold"> Đăng kí tài khoản</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <div className='w-11/12 mx-4 space-y-2 justify-center'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tài khoản</FormLabel>
                  <FormControl>
                    <Input placeholder='test123' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='email@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder=''
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập lại mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=''
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button variant='outline' className='w-11/12 mx-4 grid justify-items-center text-white mt-6 bg-green-600 border-2 border-green-600' type='submit'>
            Đăng kí
          </Button>
        </form>

        <p className='text-center text-sm text-black mt-2'>
          Nếu bạn đã có tài khoản, hãy&nbsp;
          <Link className='text-blue-500 hover:underline' href='/signin'>
            đăng nhập tại đây
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignUpForm;
