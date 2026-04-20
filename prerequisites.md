# Prerequisites for local development

## Install Hugo

```
winget install -e --id Hugo.Hugo.Extended -v "0.160.1"
```

## Clone repository and update submodule

```
git clone --recurse-submodules https://github.com/kovergard/overgard-blog .\overgard-blog
```

## Profit

```
cd .\overgard-blog
hugo server
```
