// хелперы для опциональных значений
type Nullable<T> = T | null;
type Optional<T> = T | undefined;

// обертка над массивом
type List<T> = T[];

// Так как инпуты возвращают строки, нам потребуется тип, который выразит _намерение_ получить число из строки:
type NumberLike = string;

type Comparable = string | number;

// для улучшения читаемости кода
type DateString = string;
type TimeStamp = number;
type NumberYears = number;

type LocalFile = File;
type Image = LocalFile;
