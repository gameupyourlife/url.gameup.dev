"use client";

import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { shortenUrl } from "./action";
import { useRef, useState } from 'react'
import {Snippet} from "@nextui-org/snippet";

export default function Home() {
    const ref = useRef<HTMLFormElement>(null)
    const [link, setLink] = useState("")

    return (
        <section className="flex flex-col items-center justify-center gap-4 h-full pb-20">
            <div className="inline-block max-w-lg text-center justify-center">
                <h1 className={title()}>Shorten your URL&nbsp;</h1>
                <br />
                <h1 className={title({ color: "violet" })}>fast&nbsp;</h1>
                <h1 className={title()}>
                    and&nbsp;
                </h1>
                <h1 className={title({ color: "violet" })}>easy&nbsp;</h1>

            </div>
            <form className="flex gap-3" ref={ref}
                action={async (formData) => {
                    let url = await shortenUrl(formData)
                    ref.current?.reset()

                    if (typeof(url) == "string") {
                        setLink(url)
                    }
                }}
            >
                <Input
                    isRequired
                    type="text"
                    label="Url"
                    className="max-w-xs"
                    size="sm"
                    radius="sm"
                    id="url"
                    name="url"
                />
                <Input type="string" label="Custom Url" id="custom" name="custom" size="sm" radius="sm" />
                <Button type="submit" color="primary" size="lg" radius="sm"     >
                    Shorten
                </Button>
            </form>
            {link.length > 1 && <Snippet>{link}</Snippet>}
            <div className="flex gap-3">
                <Link
                    isExternal
                    className={buttonStyles({ variant: "bordered", radius: "full" })}
                    href={"https://github.com/gameupyourlife"}
                >
                    <GithubIcon size={20} />
                    GitHub
                </Link>
            </div>

        </section>
    );
}
